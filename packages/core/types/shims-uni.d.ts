/// <reference types="@dcloudio/types" />

declare module "vue" {
  type Hooks = App.AppInstance & Page.PageInstance;

  interface ComponentCustomOptions extends Hooks {}
}

export {};