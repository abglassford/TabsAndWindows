import React from 'react';
import { useParams } from 'react-router-dom';
import TabForm from './TabForm';
import JsonViewer from './JsonViewer';

type WindowParams = {
  componentType?: string;
  id?: string;
};

const WindowRouter: React.FC = () => {
  const { componentType = '', id = '' } = useParams<WindowParams>();

  switch (componentType) {
    case 'json':
      return <JsonViewer tabIndex={Number(id)} />;
    case 'tab':
      return <TabForm tabIndex={Number(id)} />;
    default:
      return (
        <div role="alert">
          Unknown component type: {componentType}
        </div>
      );
  }
};

export default WindowRouter;