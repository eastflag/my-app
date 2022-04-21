import { observer, useLocalObservable } from 'mobx-react-lite';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const MobxLocalState = observer(() => {
  const timer = useLocalObservable(() => ({
    secondsPassed: 0,
    increaseTimer() {
      this.secondsPassed++;
    },
  }));

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Mobx Local State (like useState)
      </Typography>
      <Typography variant="h4" gutterBottom>
        {timer.secondsPassed}
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          timer.increaseTimer();
        }}
      >
        LocalStore Add +1
      </Button>
      <div>
        <Link to="/sample">Back to Sample page</Link>
      </div>
    </Box>
  );
});

export default MobxLocalState;
