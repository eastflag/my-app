import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Paper, Button, Typography } from '@mui/material';
import CustomImageViewer from '../../../components/common/custom/CustomImageViewer';
import CustomFileViewer from '../../../components/common/custom/CustomFileViewer';

/* eslint-disable */
const FileViewer = observer(() => {
  const [fileUrl, setFileUrl] = useState<string[]>([]);

  const onClick = () => {
    // setFileUrl(['https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png']);
    // setFileUrl(['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3']);
    // setFileUrl(['http://techslides.com/demos/sample-videos/small.mp4']);
  };

  return (
    <>
      <div>
        <Paper elevation={0}>
          {/* <Button onClick={onClick}>Button</Button> */}
          <br />
          <br />
          <Typography variant="h4">File Viewer</Typography>
          <br />
          <br />
          <Typography variant="h6">FileViewer - only file names</Typography>
          <br />
          <CustomFileViewer
            width={400}
            fileUrls={['file1.png', 'abcdefghijklmnopqrstuvwxys.txt', 'set_handleFileClick_for_click.pdf']}
            handleClickFile={(fileUrl) => {
              console.log('download this file ', fileUrl);
            }}
          />
          <br />
          <br />
          <Typography variant="h6">FileViewer - image viewer</Typography>
          <br />
          <CustomFileViewer
            width={400}
            showPreview={true}
            fileUrls={['https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png']}
            handleClickFile={(fileUrl) => {
              console.log('download this file ', fileUrl);
            }}
          />
          <br />
          <br />
          <Typography variant="h6">FileViewer - audio viewer</Typography>
          <br />
          <CustomFileViewer
            width={400}
            showPreview={true}
            fileUrls={['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3']}
            handleClickFile={(fileUrl) => {
              console.log('download this file ', fileUrl);
            }}
          />
          <br />
          <br />
          <Typography variant="h6">FileViewer - video viewer</Typography>
          <br />
          <CustomFileViewer
            width={400}
            showPreview={true}
            fileUrls={['http://techslides.com/demos/sample-videos/small.mp4']}
            handleClickFile={(fileUrl) => {
              console.log('download this file ', fileUrl);
            }}
          />
          <br />
          <br />
          <br />
          <Typography variant="h4">Image Viewer</Typography>
          <br />
          <br />
          <Typography variant="h6">ImageViwer - Rectangle</Typography>
          <br />
          <CustomImageViewer
            shape="rectangle"
            width={300}
            // height={500}
            fileUrl="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
          />
          <br />
          <br />
          <Typography variant="h6">ImageViewer - Circle</Typography>
          <br />
          <CustomImageViewer
            shape="circle"
            width={120}
            fileUrl="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
          />
          <br />
          <br />
        </Paper>
      </div>
    </>
  );
});

export default FileViewer;
