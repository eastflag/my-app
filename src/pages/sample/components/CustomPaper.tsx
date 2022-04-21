import { observer } from 'mobx-react-lite';
import { Typography, Box } from '@mui/material';

import Spacer from '../../../components/common/Spacer';
import CustomPaper from '../../../components/common/custom/CustomPaper';
import { Trans } from 'react-i18next';

const CustomPaperSample = observer(() => {
  return (
    <>
      <Spacer y={5} />
      <Typography variant="h4">Custom Paper</Typography>
      <Spacer y={3} />
      <Typography variant="h6">Custom Paper - With all Props</Typography>
      <CustomPaper
        title="Title"
        description="description"
        topRightHelperText="Required Fields"
        tooltipTitle="tooltipTilte"
      >
        <Box>content</Box>
      </CustomPaper>
      <Spacer y={3} />
      <Typography variant="h6">Custom Paper - Only Required Props</Typography>
      <CustomPaper title="Title">
        <Box>content</Box>
      </CustomPaper>
      <Spacer y={3} />
      <Typography variant="h6">Custom Paper - Description Props(ReactNode)</Typography>
      <CustomPaper
        title="Title"
        description={
          <Trans i18nKey={'member:login.twoFactor.phoneSubtitle'}>
            {[<Box key="strongTag" component="strong" color="secondary.main" fontFamily="Poppins, Pretendard" />]}
          </Trans>
        }
      >
        <Box>content</Box>
      </CustomPaper>
    </>
  );
});

export default CustomPaperSample;
