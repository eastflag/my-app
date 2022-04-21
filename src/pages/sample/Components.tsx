import { Button, Paper } from '@mui/material';
import { Routes, Route, Outlet, Link as RouterLink } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import TypographyComponents from './components/Typography';
import AllComponents from './components/AllComponents';
import ChipComponents from './components/Chip';
import DialogComponents from './components/Dialog';
import FileViewer from './components/FileViewer';
import TestWithTheme from './components/TestWithTheme';
import SelectComponents from './components/Select';
import FilterComponents from './components/Filter';
import TableComponents from './components/Table';
import CustomPaperComponents from './components/CustomPaper';
import Editor from './components/Editor';
import Accordion from './components/Accordion';

/* eslint-disable */
const ComponentsRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<ComponentsPage />}>
        <Route path="dialog" element={<DialogComponents />} />
        <Route path="fileupload" element={<FileUpload />} />
        <Route path="fileviewer" element={<FileViewer />} />
        <Route path="typography" element={<TypographyComponents />} />
        <Route path="chip" element={<ChipComponents />} />
        <Route path="select" element={<SelectComponents />} />
        <Route path="filter" element={<FilterComponents />} />
        <Route path="table" element={<TableComponents />} />
        <Route path="customPaper" element={<CustomPaperComponents />} />
        <Route path="editor" element={<Editor />} />
        <Route path="accordion" element={<Accordion />} />
        <Route path="all" element={<AllComponents />} />
        <Route path="testWithTheme" element={<TestWithTheme />} />
      </Route>
    </Routes>
  );
};

const ComponentsPage = () => {
  const components = [
    {
      name: 'Table with Theme',
      to: 'testWithTheme',
    },
    {
      name: 'File Upload',
      to: 'fileupload',
    },
    {
      name: 'File Viewer',
      to: 'fileviewer',
    },
    {
      name: 'Dialog',
      to: 'dialog',
    },
    {
      name: 'Typography',
      to: 'typography',
    },
    {
      name: 'Chip',
      to: 'chip',
    },
    {
      name: 'Select',
      to: 'select',
    },
    {
      name: 'Filter',
      to: 'filter',
    },
    {
      name: 'Table',
      to: 'table',
    },
    {
      name: 'CustomPaper',
      to: 'customPaper',
    },
    {
      name: 'Editor',
      to: 'editor',
    },
    {
      name: 'Accordion',
      to: 'accordion',
    },
    {
      name: 'All Components',
      to: 'all',
    },
  ];

  return (
    <>
      <div>
        <Paper elevation={0}>
          {components.map((component) => {
            return (
              <Button
                key={component.to}
                component={RouterLink}
                to={'/sample/components/' + component.to}
                variant="contained"
              >
                {component.name}
              </Button>
            );
          })}
          <Outlet />
        </Paper>
      </div>
    </>
  );
};

export default ComponentsRoute;
