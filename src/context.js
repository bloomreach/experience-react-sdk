import React from 'react';

export const PageModelContext = React.createContext({});
export const PreviewContext = React.createContext("");
export const ComponentDefinitionsContext = React.createContext({});
export const CreateLinkContext = React.createContext();

export function withPageModel(Component) {
  return function PageModelComponent(props) {
    return (
      <PageModelContext.Consumer>
        {pageModel => <Component {...props} pageModel={pageModel} />}
      </PageModelContext.Consumer>
    );
  };
}