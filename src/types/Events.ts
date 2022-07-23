export type Events = {
  onClickEvent: React.MouseEvent<HTMLInputElement>;
  onChangeEvent: React.ChangeEvent<HTMLInputElement>;
  onkeypressEvent: React.KeyboardEvent<HTMLInputElement>;
  onBlurEvent: React.FocusEvent<HTMLInputElement>;
  onFocusEvent: React.FocusEvent<HTMLInputElement>;
  onSubmitEvent: React.FormEvent<HTMLFormElement>;
  onClickDivEvent: React.MouseEvent<HTMLDivElement, MouseEvent>;
};
