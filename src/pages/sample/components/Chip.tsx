import { Chip, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import AttachFileIcon from '@mui/icons-material/AttachFile';

/* eslint-disable */
const ChipComponents = () => {
  return (
    <>
      <div>
        <br />
        <Typography variant="h4">Chip</Typography>
        <br />
        <Typography variant="h6">Medium</Typography>
        <br />
        <Chip label="Almost before 한글 폰트는" />
        <br />
        <br />
        <Chip label="Almost before 한글 폰트는" onDelete={() => {}} />
        <br />
        <br />
        <Chip label="Almost before 한글 폰트는" icon={<AttachFileIcon />} />
        <br />
        <br />
        <Chip label="Almost before 한글 폰트는" icon={<AttachFileIcon />} onDelete={() => {}} />
        <br />
        <Typography variant="h6">Small</Typography>
        <br />
        <Chip label="Almost before 한글 폰트는" size="small" />
        <br />
        <br />
        <Chip label="Almost before 한글 폰트는" size="small" onDelete={() => {}} />
        <br />
        <br />
        <Chip label="Almost before 한글 폰트는" size="small" icon={<AttachFileIcon />} />
        <br />
        <br />
        <Chip label="Almost before 한글 폰트는" size="small" icon={<AttachFileIcon />} onDelete={() => {}} />
        <br />
        {/* <Chip label="Almost before 한글 폰트는" size="small" /><br/> */}
      </div>
    </>
  );
};

export default ChipComponents;
