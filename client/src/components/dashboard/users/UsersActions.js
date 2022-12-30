import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Check from '@mui/icons-material/Check';
import Save from '@mui/icons-material/Save';
import { green } from '@mui/material/colors';

import { updateUsers, getUsers } from '../../../actions/users';

const UsersActions = ({ params, rowId, setRowId }) => {

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const { apellidos, nombres, sexo, dni, nacimiento, tipo, localidad, celular, estado_civil, domicilio, id } = params.row;
    const result = await updateUsers( { apellidos, nombres, sexo, dni, nacimiento, tipo, localidad, celular, estado_civil, domicilio }, id);
    if (result) {
      setSuccess(true);
      setRowId(null);
      dispatch(getUsers());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (rowId === params.id && success) setSuccess(false);
      // eslint-disable-next-line
  }, [rowId]);

  return (
    <Box sx={{ m: 1, position: 'relative' }} >
      {success ? (
        <Fab color="primary" sx={{ width: 40, height: 40, bgcolor: green[500], '&:hover': { bgcolor: green[700] } }}>
          <Check />
        </Fab> ) : (
        <Fab color="primary" sx={{ width: 40, height: 40 }}
          disabled={params.id !== rowId || loading}
          onClick={handleSubmit} >
          <Save />
        </Fab> )
      }
      {loading && (
        <CircularProgress size={52}
          sx={{
            color: green[500],
            position: 'absolute',
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default UsersActions;