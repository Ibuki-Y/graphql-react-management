import { FC, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Search } from '@material-ui/icons';
import { SEARCH_EMPLOYEE } from '../../query/queries';
import { Employee } from '../../types/Query';
import styles from '../../styles/modules/FilterByName.module.css';

export const FilterByName: FC = () => {
  const [searchByName, setSearchByName] = useState('');
  const [searchEmployee, { data: dataSearch, error: errorSearch }] = useLazyQuery(SEARCH_EMPLOYEE, {
    // cacheを使わない(サーバーから取得)
    fetchPolicy: 'network-only',
  });
  const searchEmployeeFunction = async () => {
    try {
      await searchEmployee({
        variables: {
          name: searchByName,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchByName(e.target.value);
  };

  return (
    <>
      <h3>Filter by Employee Name</h3>

      <input
        placeholder="employee name"
        type="text"
        value={searchByName}
        onChange={onChangeSearch}
      />

      <div>
        <Search className={styles.filterByName__search} onClick={searchEmployeeFunction} />
      </div>

      <ul className={styles.filterByName__list}>
        {errorSearch && <h3>{errorSearch.message}</h3>}
        {dataSearch &&
          dataSearch.allEmployees &&
          dataSearch.allEmployees.edges.map((employee: Employee) => (
            <li className={styles.filterByName__item} key={employee.node.id}>
              {employee.node.name}
              {' / '}
              {employee.node.joinYear}
              {' / '}
              {employee.node.department.deptName}
            </li>
          ))}
      </ul>
    </>
  );
};
