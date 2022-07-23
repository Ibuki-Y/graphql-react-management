// dataEmployees(Props) Type
export type EmployeesProps = {
  dataEmployees: any;
};

// dataDepts(Props) Type
export type DeptsProps = {
  dataDepts: any;
};

// Employee Type
export type Employee = {
  node: {
    id: string;
    name: string;
    joinYear: number;
    department: {
      id: string;
      deptName: string;
    };
  };
};

// Employee Type
export type Dept = {
  node: {
    id: string;
    deptName: string;
  };
};
