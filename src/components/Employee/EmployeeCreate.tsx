import { FC, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE, GET_EMPLOYEES } from '../../query/queries';
import { StateContext } from '../../context/StateContext';
import { DeptsProps, Dept } from '../../types/Query';
import styles from '../../styles/modules/EmployeeCreate.module.css';

export const EmployeeCreate: FC<DeptsProps> = (props) => {
  const { dataDepts } = props;
  const {
    name,
    setName,
    joinYear,
    setJoinYear,
    selectedDept,
    setSelectedDept,
    editedId,
    setEditedId,
  } = useContext(StateContext);

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    // employee作成後に実行
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });
  const createEmployeeFunction = async () => {
    try {
      await createEmployee({
        variables: {
          name: name,
          joinYear: joinYear,
          department: selectedDept,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
    // 初期化
    setName('');
    setJoinYear(2022);
    setSelectedDept('');
  };

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });
  const updateEmployeeFunction = async () => {
    try {
      await updateEmployee({
        variables: {
          id: editedId,
          name: name,
          joinYear: joinYear,
          department: selectedDept,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
    // 初期化
    setEditedId('');
    setName('');
    setJoinYear(2022);
    setSelectedDept('');
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onChangeJoinYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: number = Number(e.target.value);
    setJoinYear(value);
  };
  const onChangeSelectedDept = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDept(e.target.value);
  };
  const onClickButton = () => {
    editedId ? updateEmployeeFunction() : createEmployeeFunction();
  };

  // department選択
  const selectOption = dataDepts?.allDepartments.edges.map((dept: Dept) => (
    <option key={dept.node.id} value={dept.node.id}>
      {dept.node.deptName}
    </option>
  ));

  return (
    <>
      <div>
        <input
          className={styles.employeeCreate__input}
          placeholder="employee name"
          type="text"
          value={name}
          onChange={onChangeName}
        />
        <input
          className={styles.employeeCreate__input}
          placeholder="year of join"
          type="number"
          value={joinYear}
          onChange={onChangeJoinYear}
        />
      </div>

      <select value={selectedDept} onChange={onChangeSelectedDept}>
        <option value="">select</option>
        {selectOption}
      </select>

      <button
        disabled={!selectedDept || !name || !joinYear}
        className={styles.employeeCreate__btn}
        onClick={onClickButton}
      >
        {editedId ? 'UPDATE' : 'CREATE'}
      </button>
    </>
  );
};
