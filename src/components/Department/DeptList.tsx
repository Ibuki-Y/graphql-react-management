import { FC, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { Delete } from '@material-ui/icons';
import { CREATE_DEPT, DELETE_DEPT, GET_DEPTS, GET_EMPLOYEES } from '../../query/queries';
import { StateContext } from '../../context/StateContext';
import { DeptsProps, Dept } from '../../types/Query';
import styles from '../../styles/modules/DeptList.module.css';

export const DeptList: FC<DeptsProps> = (props) => {
  const { dataDepts } = props;
  const { deptName, setDeptName } = useContext(StateContext);

  const [createDept] = useMutation(CREATE_DEPT, {
    // department作成後に実行
    refetchQueries: [{ query: GET_DEPTS }],
  });
  const createDeptFunction = async () => {
    try {
      await createDept({
        variables: {
          deptName: deptName,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
    // 初期化
    setDeptName('');
  };

  const [deleteDept] = useMutation(DELETE_DEPT, {
    refetchQueries: [{ query: GET_DEPTS }, { query: GET_EMPLOYEES }],
  });
  const deleteDeptFunction = async (dept: Dept) => {
    try {
      await deleteDept({
        variables: {
          id: dept.node.id,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
    // detailsをリロード
    window.location.reload();
  };

  const onChangeDeptName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeptName(e.target.value);
  };

  return (
    <>
      <h3>Department List</h3>
      
      <input
        className={styles.deptList__input}
        placeholder="new department name"
        type="text"
        value={deptName}
        onChange={onChangeDeptName}
      />
      <button disabled={!deptName} onClick={createDeptFunction}>
        CREATE
      </button>

      <ul className={styles.deptList__list}>
        {dataDepts &&
          dataDepts.allDepartments &&
          dataDepts.allDepartments.edges.map((dept: Dept) => (
            <li className={styles.deptList__item} key={dept.node.id}>
              <span>{dept.node.deptName}</span>
              <div>
                <Delete
                  className={styles.deptList__delete}
                  onClick={async () => await deleteDeptFunction(dept)}
                />
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};
