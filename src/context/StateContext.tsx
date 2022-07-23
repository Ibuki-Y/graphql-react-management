import { FC, createContext, useState, Dispatch, SetStateAction } from 'react';
import { useLazyQuery, LazyQueryExecFunction, OperationVariables } from '@apollo/client';
import { GET_SINGLE_EMPLOYEE, GET_SINGLE_DEPT } from '../query/queries';
import { Props } from '../types/Context';

export const StateContext = createContext(
  {} as {
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    joinYear: number;
    setJoinYear: Dispatch<SetStateAction<number>>;
    deptName: string;
    setDeptName: Dispatch<SetStateAction<string>>;
    selectedDept: string;
    setSelectedDept: Dispatch<SetStateAction<string>>;
    editedId: string;
    setEditedId: Dispatch<SetStateAction<string>>;
    dataSingleEmployee: any;
    errorSingleEmployee: any;
    getSingleEmployee: LazyQueryExecFunction<any, OperationVariables>;
    dataSingleDept: any;
    errorSingleDept: any;
    getSingleDept: LazyQueryExecFunction<any, OperationVariables>;
  }
);

export const StateContextProvider: FC<Props> = (props) => {
  const { children } = props;
  const [name, setName] = useState('');
  const [joinYear, setJoinYear] = useState(2022);
  const [deptName, setDeptName] = useState('');
  // employee作成時のdept指定
  const [selectedDept, setSelectedDept] = useState('');
  // 編集時のid指定
  const [editedId, setEditedId] = useState('');
  /* 
  single employeeを取得
  useQuery: Componentがrenderされたらクエリ実行
  useLazyQuery: 任意のイベントをトリガーにしてクエリ実行
  */
  const [getSingleEmployee, { data: dataSingleEmployee, error: errorSingleEmployee }] =
    useLazyQuery(GET_SINGLE_EMPLOYEE, {
      // cacheを使わない(サーバーから取得)
      fetchPolicy: 'network-only',
    });
  const [getSingleDept, { data: dataSingleDept, error: errorSingleDept }] = useLazyQuery(
    GET_SINGLE_DEPT,
    { fetchPolicy: 'network-only' }
  );

  return (
    <StateContext.Provider
      value={{
        name,
        setName,
        joinYear,
        setJoinYear,
        deptName,
        setDeptName,
        selectedDept,
        setSelectedDept,
        editedId,
        setEditedId,
        dataSingleEmployee,
        errorSingleEmployee,
        getSingleEmployee,
        dataSingleDept,
        errorSingleDept,
        getSingleDept,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
