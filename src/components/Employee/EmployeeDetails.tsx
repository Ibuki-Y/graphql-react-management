import { FC, useContext } from 'react';
import { StateContext } from '../../context/StateContext';

export const EmployeeDetails: FC = () => {
  const { dataSingleEmployee, errorSingleEmployee, errorSingleDept } = useContext(StateContext);

  if (errorSingleEmployee || errorSingleDept) {
    return (
      <>
        <h3>Employee Details</h3>
        {errorSingleEmployee.message}
      </>
    );
  }

  return (
    <>
      <h3>Employee Details</h3>
      {errorSingleEmployee && errorSingleEmployee.message}
      {dataSingleEmployee && dataSingleEmployee.employee && (
        <>
          <h3>ID: </h3>
          {dataSingleEmployee.employee.id}
          <h3>Employee Name: </h3>
          {dataSingleEmployee.employee.name}
          <h3>Year of Join: </h3>
          {dataSingleEmployee.employee.joinYear}
          <h3>Department Name: </h3>
          {dataSingleEmployee.employee.department.deptName}
        </>
      )}
    </>
  );
};
