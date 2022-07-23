import { FC, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useLazyQuery } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import {
  PAGINATE_FIRST_EMPLOYEE,
  PAGINATE_LAST_EMPLOYEE,
  PAGINATE_MORE_EMPLOYEE,
} from '../../query/queries';
import { Dept, Employee } from '../../types/Query';
import styles from '../../styles/modules/Pagination.module.css';

// loadingページ数
const NUM_PAGE = 3;

export const Pagination: FC = () => {
  const [first, setFirst] = useState(0);
  const [last, setLast] = useState(0);

  const [paginateFirst, { data: dataFirst, error: errorFirst }] = useLazyQuery(
    PAGINATE_FIRST_EMPLOYEE,
    // cache => server
    { fetchPolicy: 'cache-and-network' }
  );
  const paginateFirstFunction = async () => {
    try {
      await paginateFirst({
        variables: {
          first: first,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
    // 初期化
    setFirst(0);
  };

  const [paginateLast, { data: dataLast, error: errorLast }] = useLazyQuery(
    PAGINATE_LAST_EMPLOYEE,
    { fetchPolicy: 'cache-and-network' }
  );
  const paginateLastFunction = async () => {
    try {
      await paginateLast({
        variables: {
          last: last,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
    setLast(0);
  };

  const {
    data: dataPages,
    error: errorPages,
    loading: loadingPages,
    fetchMore,
  } = useQuery(PAGINATE_MORE_EMPLOYEE, {
    variables: { first: NUM_PAGE, after: null },
    fetchPolicy: 'cache-and-network',
  });
  const fetchMoreFunction = async () => {
    try {
      // 追加でサーバーにアクセス
      await fetchMore({
        variables: {
          first: NUM_PAGE,
          after: dataPages.allDepartments.pageInfo.endCursor || null,
        },
        // prevLoad: 前に取得したデータ, fetchMoreResult: 今回取得したデータ
        updateQuery: (prevLoad, { fetchMoreResult }) => {
          fetchMoreResult.allDepartments.edges = [
            ...prevLoad.allDepartments.edges,
            ...fetchMoreResult.allDepartments.edges,
          ];
          return fetchMoreResult;
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const onChangeFirst = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: number = Number(e.target.value);
    setFirst(value);
  };
  const onChangeLast = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: number = Number(e.target.value);
    setLast(value);
  };

  if (loadingPages) return <h1>Lading from Server...</h1>;

  return (
    <div>
      <Grid container>
        <Grid item xs={4}>
          <h3>Paginate by First</h3>
          <input type="number" min="0" value={first} onChange={onChangeFirst} />
          <div>
            <Search className={styles.pagination__search} onClick={paginateFirstFunction} />
          </div>
          <ul className={styles.pagination__list}>
            {errorFirst && <h3>{errorFirst.message}</h3>}
            {dataFirst &&
              dataFirst.allEmployees &&
              dataFirst.allEmployees.edges.map((employee: Employee) => (
                <li className={styles.pagination__item} key={employee.node.id}>
                  {employee.node.name}
                  {' / '}
                  {employee.node.joinYear}
                  {' / '}
                  {employee.node.department.deptName}
                </li>
              ))}
          </ul>
        </Grid>
        <Grid item xs={4}>
          <h3>Paginate by Last</h3>
          <input type="number" min="0" value={last} onChange={onChangeLast} />
          <div>
            <Search className={styles.pagination__search} onClick={paginateLastFunction} />
          </div>
          <ul className={styles.pagination__list}>
            {errorLast && <h3>{errorLast.message}</h3>}
            {dataLast &&
              dataLast.allEmployees &&
              dataLast.allEmployees.edges.map((employee: Employee) => (
                <li className={styles.pagination__item} key={employee.node.id}>
                  {employee.node.name}
                  {' / '}
                  {employee.node.joinYear}
                  {' / '}
                  {employee.node.department.deptName}
                </li>
              ))}
          </ul>
        </Grid>
        <Grid item xs={4}>
          <h3>Pagination Load More</h3>
          <ul>
            {errorPages && <h3>{errorPages.message}</h3>}
            {dataPages &&
              dataPages.allDepartments &&
              dataPages.allDepartments.edges.map((dept: Dept) => (
                <li className={styles.pagination__item} key={dept.node.id}>
                  {dept.node.deptName}
                </li>
              ))}
          </ul>
          {dataPages.allDepartments.pageInfo.hasNextPage && (
            <button onClick={fetchMoreFunction}>Load More</button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};
