import { Paper, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import CustomFileUpload, { FileObject } from '../../../components/common/custom/CustomFileUpload';
import CustomImageUpload from '../../../components/common/custom/CustomImageUpload';
import { FileType } from '../../../utils/FileUtils';

/* eslint-disable */
const FileUpload = observer(() => {
  const submitButtonOnClick = (values: any) => {
    console.log('submitButtonOnClick');
    console.log(JSON.stringify(values, null, 2));
  };

  return (
    <>
      <div>
        <Paper elevation={0}>
          <br />
          <br />
          <Typography variant="h4">File Upload</Typography>
          <br />
          <br />
          <Formik initialValues={{}} onSubmit={submitButtonOnClick}>
            {() => (
              <Form name="fileUploadForm">
                {/* <Button type="submit">SUBMIT</Button> */}
                <Typography variant="h6">FileUpload - Only one file with Preview</Typography>
                <br />
                <CustomFileUpload
                  id="FileUpload1"
                  width={400}
                  extension={['jpg', 'gif', 'png', 'mp4', 'mp3', 'ogg', 'avi', 'wav']}
                  maxFileCount={1}
                  maxFileSizeInMb={500}
                  showPreviewTypeList={[FileType.IMAGE, FileType.AUDIO, FileType.VIDEO]}
                  handleFileChanged={(files: FileObject[]) => {
                    console.log('fileSelected ' + files.length);
                    console.log('fileSelected ', files);
                    console.log('fileSelected ' + files?.[0]?.object.name);
                  }}
                  handleExtensionError={() => {
                    console.log('extension error');
                  }}
                  handleMaxFileCountExceeded={() => {
                    console.log('max file count error!!');
                  }}
                  handleMaxFileSizeError={() => {
                    console.log('max file size error!!');
                  }}
                  handleFileAlreadyExistError={() => {
                    console.log('file already exists');
                  }}
                />
                <br />
                <br />
                <Typography variant="h6">FileUpload - Only one file with Initial Preview</Typography>
                <br />
                <CustomFileUpload
                  id="FileUpload2"
                  width={400}
                  extension={['jpg', 'gif', 'png', 'mp4', 'mp3']}
                  maxFileCount={1}
                  maxFileSizeInMb={500}
                  showPreviewTypeList={[FileType.IMAGE, FileType.AUDIO, FileType.VIDEO]}
                  handleFileChanged={(files: FileObject[]) => {
                    console.log('fileSelected ' + files.length);
                    console.log('fileSelected ', files);
                    console.log('fileSelected ' + files?.[0]?.object.name);
                  }}
                  handleExtensionError={() => {
                    console.log('extension error');
                  }}
                  handleMaxFileCountExceeded={() => {
                    console.log('max file count error!!');
                  }}
                  handleMaxFileSizeError={() => {
                    console.log('max file size error!!');
                  }}
                  handleFileAlreadyExistError={() => {
                    console.log('file already exists');
                  }}
                  initialFiles={['https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png']}
                />
                <br />
                <br />
                <Typography variant="h6">FileUpload - Multi files without Preview</Typography>
                <CustomFileUpload
                  id="FileUpload3"
                  width={600}
                  extension={['jpg', 'gif', 'png', 'mp4', 'mp3']}
                  maxFileCount={5}
                  maxFileSizeInMb={100}
                  showPreviewTypeList={[]}
                  handleFileChanged={(files: FileObject[]) => {
                    console.log('fileSelected ' + files.length);
                    console.log('fileSelected ' + files?.[0]?.object.name);
                  }}
                  handleExtensionError={() => {
                    console.log('extension error');
                  }}
                  handleMaxFileCountExceeded={() => {
                    console.log('max file count error!!');
                  }}
                  handleMaxFileSizeError={() => {
                    console.log('max file size error!!');
                  }}
                  handleFileAlreadyExistError={() => {
                    console.log('file already exists');
                  }}
                  initialFiles={[
                    'already_registered_file1.jpg',
                    'use_initialFiles_in_props.gif',
                    'registered_file_has_minus_id_in_handleFileChanged.mp4',
                  ]}
                />
                <br />
                <br />
                <br />
                <Typography variant="h4">Image Upload</Typography>
                <br />
                <br />
                <Typography variant="h6">ImageUpload - Rectangle</Typography>
                <br />
                <CustomImageUpload
                  id="upload1"
                  shape="rectangle"
                  width={300}
                  // height={500}
                  extension={['jpg', 'gif', 'png']}
                  maxFileSizeInMb={5}
                  handleFileChanged={(file: File) => {
                    console.log('fileSelected ' + file?.name);
                  }}
                  handleExtensionError={() => {
                    console.log('extension error');
                  }}
                  handleMaxFileCountExceeded={() => {
                    console.log('max file count error');
                  }}
                  initialFile="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
                />
                <br />
                <br />
                <Typography variant="h6">ImageUpload - Circle</Typography>
                <br />
                <CustomImageUpload
                  id="upload2"
                  shape="circle"
                  width={120}
                  // height={500}
                  extension={['jpg', 'gif', 'png']}
                  maxFileSizeInMb={5}
                  handleFileChanged={() => {
                    console.log('fileSelected');
                  }}
                />
                <br />
                <br />
              </Form>
            )}
          </Formik>
        </Paper>
      </div>
    </>
  );
});

export default FileUpload;
