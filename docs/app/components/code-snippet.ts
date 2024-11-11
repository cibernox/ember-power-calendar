import Component from '@glimmer/component';

interface CodeSnippetSignature {
  Element: HTMLElement;
  Args: {
    name: string;
  };
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class CodeSnippet extends Component<CodeSnippetSignature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CodeSnippet: typeof CodeSnippet;
  }
}
