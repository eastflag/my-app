import { Backdrop, CircularProgress, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { observer } from 'mobx-react-lite';
import { useStore } from '../contexts/StoreProvider';

const useStyle = makeStyles((theme: Theme) => ({
  dim: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

const Dim = observer(() => {
  const { dimStore } = useStore();
  const classes = useStyle();

  return (
    <Backdrop className={`${classes.dim}`} open={dimStore.isActive}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
});

export default Dim;
