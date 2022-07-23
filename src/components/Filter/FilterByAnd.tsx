import { FC, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Search } from '@material-ui/icons';
import { SEARCH_AND_EMPLOYEE } from '../../query/queries';
import { Employee } from '../../types/Query';
import styles from '../../styles/modules/FilterByAnd.module.css';

export const FilterByAnd: FC = () => {
  const [searchName, setSearchName] = useState('');
  const [searchJoinYear, setSearchJoinYear] = useState(2022);
  const [searchDept, setSearchDept] = useState('');

  const [searchAndEmployee, { data: dataSearchAnd, error: errorSearchAnd }] = useLazyQuery(
    SEARCH_AND_EMPLOYEE,
    // cacheを使わない(サーバーから取得)
    { fetchPolicy: 'network-only' }
  );
  const searchAndEmployeeFunction = async () => {
    console.log('called');
    let joinYearData: null | number;
    // joinYearが0のままのときはnullをクエリに渡す
    if (searchJoinYear === 0) {
      joinYearData = null;
    } else {
      joinYearData = searchJoinYear;
    }

    await searchAndEmployee({
      variables: {
        name: searchName,
        joinYear: joinYearData,
        dept: searchDept,
      },
    });
    // 初期化
    setSearchName('');
    setSearchJoinYear(0);
    setSearchDept('');
  };

  const onChangeSearchName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };
  const onChangeSearchJoinYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: number = Number(e.target.value);
    setSearchJoinYear(value || 0);
  };
  const onChangeSearchDept = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDept(e.target.value);
  };

  return (
    <>
      <h3>Filter by And Condition</h3>

      <input
        className={styles.filterByAnd__input}
        placeholder="employee name"
        type="text"
        value={searchName}
        onChange={onChangeSearchName}
      />
      <input
        className={styles.filterByAnd__input}
        type="number"
        min="0"
        value={searchJoinYear}
        onChange={onChangeSearchJoinYear}
      />
      <input
        placeholder="department name"
        type="text"
        value={searchDept}
        onChange={onChangeSearchDept}
      />

      <div>
        <Search className={styles.filterByAnd__search} onClick={searchAndEmployeeFunction} />
      </div>

      <ul className={styles.filterByAnd__list}>
        {errorSearchAnd && <h3>{errorSearchAnd.message}</h3>}
        {dataSearchAnd &&
          dataSearchAnd.allEmployees &&
          dataSearchAnd.allEmployees.edges.map((employee: Employee) => (
            <li className={styles.filterByAnd__item} key={employee.node.id}>
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
