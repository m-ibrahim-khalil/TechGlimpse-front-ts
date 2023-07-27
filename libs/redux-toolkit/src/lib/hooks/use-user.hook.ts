import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useDeleteUserByUsernameMutation,
  useGetUserByUsernameQuery,
  useUpdatePasswordMutation,
} from '../api/userApi';
import {
  erroHandler,
  isErrorWithMessage,
  isFetchBaseQueryError,
} from '../helpers';
import { logout } from '../reducers/auth-slice.reducer';
import { AppDispatch } from '../store/store';
import useDialog from './use-dialog.hook';

export function useUser() {
  const navigate = useNavigate();
  const { openDialog, closeDialog } = useDialog();
  const dispatch: AppDispatch = useDispatch();
  const [deleteUserMutation, { isLoading: deleteUserLoading }] =
    useDeleteUserByUsernameMutation();
  const [
    updatePasswordMutation,
    { isLoading: updatePasswordLoading, error: updatePasswordError },
  ] = useUpdatePasswordMutation();

  const getUserByUsername = (username: string) => {
    try {
      const { data: user } = useGetUserByUsernameQuery({ username });
      console.log('useUser Hook user: ', user);
      return user;
    } catch (err) {
      let errMsg = '';
      if (isFetchBaseQueryError(err))
        errMsg = err.data?.message ?? JSON.stringify(err.data);
      else if (isErrorWithMessage(err)) errMsg = err.message;
      if (errMsg) {
        const nav = erroHandler(errMsg);
        if (nav) return navigate(nav);
      }
    }
  };

  const updatePasswordByUsername = useCallback(
    async (username: string, oldPassword: string, newPassword: string) => {
      try {
        const res = await updatePasswordMutation({
          username,
          oldPassword,
          newPassword,
        }).unwrap();
        console.log('res: ', res);
        toast.success('Update Password success');
        navigate('/blogs');
      } catch (err) {
        let errMsg = '';
        if (isFetchBaseQueryError(err))
          errMsg = err.data?.message ?? JSON.stringify(err.data);
        else if (isErrorWithMessage(err)) errMsg = err.message;
        if (errMsg) {
          const nav = erroHandler(errMsg);
          if (nav) {
            dispatch(logout());
            toast.info('Please login again');
            navigate(nav);
          }
        }
      }
    },
    [updatePasswordMutation]
  );

  const deleteUserByUsername = useCallback(
    (username: string) => {
      console.log(username);
      openDialog(async () => {
        try {
          const res = await deleteUserMutation({ username }).unwrap();
          console.log('res: ', res);
          toast.success('Delete User Profile success');
          dispatch(logout());
          navigate('/');
        } catch (err) {
          let errMsg = '';
          if (isFetchBaseQueryError(err))
            errMsg = err.data?.message ?? JSON.stringify(err.data);
          else if (isErrorWithMessage(err)) errMsg = err.message;
          if (errMsg) {
            const nav = erroHandler(errMsg);
            if (nav) {
              dispatch(logout());
              toast.info('Please login again');
              navigate(nav);
            }
          }
        }
        closeDialog();
      });
    },
    [deleteUserMutation, closeDialog, openDialog]
  );

  return {
    getUserByUsername,
    updatePasswordByUsername,
    updatePasswordLoading,
    updatePasswordError,
    deleteUserByUsername,
    deleteUserLoading,
  };
}

export default useUser;