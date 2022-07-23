/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import jwtDecode from 'jwt-decode';
import { Grid } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import { GET_EMPLOYEES, GET_DEPTS } from '../query/queries';
import { MyToken } from '../types/Token';
import { EmployeeCreate } from './Employee/EmployeeCreate';
import { EmployeeList } from './Employee/EmployeeList';
import { EmployeeDetails } from './Employee/EmployeeDetails';
import { DeptList } from './Department/DeptList';
import { FilterByName } from './Filter/FilterByName';
import { FilterByAnd } from './Filter/FilterByAnd';
import { Pagination } from './Pagination/Pagination';
import styles from '../styles/modules/MainPage.module.css';

export const MainPage: FC = () => {
  const navigate = useNavigate();

  const {
    loading: loadingEmployees,
    data: dataEmployees,
    error: errorEmployees,
  } = useQuery(GET_EMPLOYEES);
  const { loading: loadingDepts, data: dataDepts, error: errorDepts } = useQuery(GET_DEPTS);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const decodedToken = jwtDecode<MyToken>(localStorage.getItem('token')!);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
      }
    } else {
      navigate('/');
    }
  }, [errorEmployees, errorDepts]); // mount||error実行

  const onClickLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loadingEmployees || loadingDepts) {
    // Loading処理
    return (
      <>
        <h1>Now Loading...</h1>
      </>
    );
  } else if (errorEmployees || errorDepts) {
    // エラー処理
    window.location.reload();
    console.log(`Employee data fetch error: ${errorEmployees?.message}`);
    console.log(`Department data fetch error: ${errorDepts?.message}`);
    return <></>;
  }

  return (
    <div className={styles.mainPage}>
      <h1>
        Employee Management System with GraphQL{' '}
        <ExitToApp className={styles.mainPage__out} onClick={onClickLogout} />
      </h1>

      <EmployeeCreate dataDepts={dataDepts} />

      <Grid container>
        <Grid item xs={5}>
          <EmployeeList dataEmployees={dataEmployees} />
        </Grid>
        <Grid item xs={4}>
          <EmployeeDetails />
        </Grid>
        <Grid item xs={3}>
          <DeptList dataDepts={dataDepts} />
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={2}>
          <FilterByName />
        </Grid>
        <Grid item xs={3}>
          <FilterByAnd />
        </Grid>
        <Grid item xs={7}>
          <Pagination />
        </Grid>
      </Grid>
    </div>
  );
};
