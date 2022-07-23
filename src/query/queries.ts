import gql from 'graphql-tag';

/* Mutation */
// ユーザー作成
export const CREATE_USER = gql`
  mutation ($username: String!, $password: String!) {
    createUser(input: { username: $username, password: $password, email: "" }) {
      user {
        id
        username
      }
    }
  }
`;

// トークン作成
export const GET_TOKEN = gql`
  mutation ($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

// employee作成
export const CREATE_EMPLOYEE = gql`
  mutation ($name: String!, $joinYear: Int!, $department: ID!) {
    createEmployee(input: { name: $name, joinYear: $joinYear, department: $department }) {
      employee {
        id
        name
        joinYear
        department {
          id
          deptName
        }
      }
    }
  }
`;

// employee更新
export const UPDATE_EMPLOYEE = gql`
  mutation ($id: ID!, $name: String!, $joinYear: Int!, $department: ID!) {
    updateEmployee(input: { id: $id, name: $name, joinYear: $joinYear, department: $department }) {
      employee {
        id
        name
        joinYear
        department {
          id
          deptName
        }
      }
    }
  }
`;

// employee削除
export const DELETE_EMPLOYEE = gql`
  mutation ($id: ID!) {
    deleteEmployee(input: { id: $id }) {
      employee {
        id
      }
    }
  }
`;

// department作成
export const CREATE_DEPT = gql`
  mutation ($deptName: String!) {
    createDept(input: { deptName: $deptName }) {
      department {
        id
        deptName
      }
    }
  }
`;

// department削除
export const DELETE_DEPT = gql`
  mutation ($id: ID!) {
    deleteDept(input: { id: $id }) {
      department {
        id
      }
    }
  }
`;

/* Query */
// employee一覧取得
export const GET_EMPLOYEES = gql`
  query {
    allEmployees {
      edges {
        node {
          id
          name
          joinYear
          department {
            id
            deptName
          }
        }
      }
    }
  }
`;

// single employee取得
export const GET_SINGLE_EMPLOYEE = gql`
  query ($id: ID!) {
    employee(id: $id) {
      id
      name
      joinYear
      department {
        id
        deptName
      }
    }
  }
`;

// employee filter(icontains)
export const SEARCH_EMPLOYEE = gql`
  query ($name: String) {
    allEmployees(name_Icontains: $name) {
      edges {
        node {
          id
          name
          joinYear
          department {
            id
            deptName
          }
        }
      }
    }
  }
`;

// employee filter(name_Icontains, joinYear, department_DeptName_Icontains)
export const SEARCH_AND_EMPLOYEE = gql`
  query ($name: String, $joinYear: Int, $dept: String) {
    allEmployees(name_Icontains: $name, joinYear: $joinYear, department_DeptName_Icontains: $dept) {
      edges {
        node {
          id
          name
          joinYear
          department {
            id
            deptName
          }
        }
      }
    }
  }
`;

// employee filter(pagination: first)
export const PAGINATE_FIRST_EMPLOYEE = gql`
  query ($first: Int) {
    allEmployees(first: $first) {
      edges {
        node {
          id
          name
          joinYear
          department {
            id
            deptName
          }
        }
      }
    }
  }
`;

// employee filter(pagination: last)
export const PAGINATE_LAST_EMPLOYEE = gql`
  query ($last: Int) {
    allEmployees(last: $last) {
      edges {
        node {
          id
          name
          joinYear
          department {
            id
            deptName
          }
        }
      }
    }
  }
`;

// employee・department filter(pagination: more)
export const PAGINATE_MORE_EMPLOYEE = gql`
  query ($first: Int, $after: String) {
    allDepartments(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          deptName
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;

// department一覧取得
export const GET_DEPTS = gql`
  query {
    allDepartments {
      edges {
        node {
          id
          deptName
        }
      }
    }
  }
`;

// single employee取得
export const GET_SINGLE_DEPT = gql`
  query ($id: ID!) {
    department(id: $id) {
      id
      deptName
    }
  }
`;
