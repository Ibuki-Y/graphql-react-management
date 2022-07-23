import { FC, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { Delete, Edit, DragIndicator } from '@material-ui/icons';
import { GET_EMPLOYEES, DELETE_EMPLOYEE } from '../../query/queries';
import { StateContext } from '../../context/StateContext';
import { EmployeesProps, Employee } from '../../types/Query';
import styles from '../../styles/modules/EmployeeList.module.css';

export const EmployeeList: FC<EmployeesProps> = (props) => {
  const { dataEmployees } = props;
  const {
    setName,
    setJoinYear,
    setSelectedDept,
    setEditedId,
    dataSingleEmployee,
    getSingleEmployee,
  } = useContext(StateContext);

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    // employee削除後に実行
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });
  const deleteEmployeeFunction = async (employee: Employee) => {
    try {
      await deleteEmployee({
        variables: {
          id: employee.node.id,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
    // 削除したemployeeが詳細表示しているemployeeのとき => error
    if (employee.node.id === dataSingleEmployee?.employee.id) {
      await getSingleEmployee({
        variables: {
          id: employee.node.id,
        },
      });
    }
  };

  const getSingleEmployeeFunction = async (employee: Employee) => {
    try {
      await getSingleEmployee({
        variables: {
          id: employee.node.id,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const onClickEdit = (employee: Employee) => {
    // inputに配置(update)
    setEditedId(employee.node.id);
    setName(employee.node.name);
    setJoinYear(employee.node.joinYear);
    setSelectedDept(employee.node.department.id);
  };

  return (
    <>
      <h3>Employee List</h3>
      <ul className={styles.employeeList__list}>
        {dataEmployees &&
          dataEmployees.allEmployees &&
          dataEmployees.allEmployees.edges.map((employee: Employee) => (
            <li className={styles.employeeList__item} key={employee.node.id}>
              <span>
                {employee.node.name}
                {' / '}
                {employee.node.joinYear}
                {' / '}
                {employee.node.department.deptName}
              </span>
              <div>
                <Delete
                  className={styles.employeeList__delete}
                  onClick={async () => await deleteEmployeeFunction(employee)}
                />
                <Edit className={styles.employeeList__edit} onClick={() => onClickEdit(employee)} />
                <DragIndicator
                  className={styles.employeeList__detail}
                  onClick={async () => await getSingleEmployeeFunction(employee)}
                />
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};
