/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import jwtDecode from 'jwt-decode';
import { FlipCameraAndroid } from '@material-ui/icons';
import { CREATE_USER, GET_TOKEN } from '../query/queries';
import { MyToken } from '../types/Token';
import styles from '../styles/modules/Auth.module.css';

export const Auth: FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [getToken] = useMutation(GET_TOKEN);
  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const decodedToken = jwtDecode<MyToken>(localStorage.getItem('token')!);
      // 有効期限が切れたとき
      if (decodedToken.exp * 1000 < Date.now()) {
        // ローカルストレージから削除
        localStorage.removeItem('token');
      } else {
        // MainPageに移動
        // window.location.href = '/employees';
        navigate('/employees');
      }
    }
  }, []);

  const authUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      // トークン取得
      try {
        const result = await getToken({
          variables: { username: username, password: password },
        });
        // 'token'をローカルストレージに保存
        localStorage.setItem('token', result.data.tokenAuth.token);
        result.data.tokenAuth.token && navigate('/employees');
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    } else {
      // ユーザー作成
      try {
        await createUser({
          variables: { username: username, password: password },
        });
        const result = await getToken({
          variables: { username: username, password: password },
        });
        localStorage.setItem('token', result.data.tokenAuth.token);
        result.data.tokenAuth.token && navigate('/employees');
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
  };

  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const onClickToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={styles.auth}>
      <form onSubmit={authUser}>
        <div className={styles.auth__input}>
          <label>UserName: </label>
          <input type="text" value={username} onChange={onChangeUserName} />
        </div>
        <div className={styles.auth__input}>
          <label>Password: </label>
          <input type="password" value={password} onChange={onChangePassword} />
        </div>

        <button disabled={username && password ? false : true} type="submit">
          {isLogin ? 'Login With JWT' : 'Create New User'}
        </button>

        <div>
          <FlipCameraAndroid className={styles.auth__toggle} onClick={onClickToggle} />
        </div>
      </form>
    </div>
  );
};
