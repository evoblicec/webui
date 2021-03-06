import React, { FC } from 'react';
import { css } from '@emotion/core';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Theme,
} from '@material-ui/core';
import TextField from 'common/inputs/formik/TextField';
import { Formik, Form } from 'formik';
import { AddListRequest } from '../types';
import { useAddList } from '../hooks/list';

interface Props {
  open?: boolean;
  onClose: () => void;
}

const errorStyle = (theme: Theme) => css`
  color: ${theme.palette.error.main};
  text-align: center;
  padding: ${theme.typography.pxToRem(theme.spacing(1))};
`;

const AddListDialog: FC<Props> = ({ open = false, onClose }) => {
  const initialValues: AddListRequest = { name: '' };
  const [{ loading, error }, addList] = useAddList();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Add New List</DialogTitle>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          const resp = await addList(values);
          if (resp.ok) {
            actions.resetForm();
            onClose();
          }
        }}
      >
        <Form>
          <DialogContent>
            {error && <DialogContentText css={errorStyle}>{error.message}</DialogContentText>}
            <TextField autoFocus id="name" label="List Name" fullWidth name="name" />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={loading}>
              Add
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default AddListDialog;
