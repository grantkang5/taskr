import React, { useState, useRef, useEffect } from "react";
import { Input, Icon, Button } from "antd";

import styles from "./Input.module.less";

interface EditButtonProps {
  defaultValue: string;
  name: string;
  value: string;
  onChange: React.FormEventHandler<HTMLInputElement>;
  clearValue: React.FormEventHandler<HTMLInputElement>;
  submit: () => void;
  style?: React.CSSProperties;
}

export const EditButton: React.FC<EditButtonProps> = ({
  name,
  defaultValue,
  value,
  onChange,
  clearValue,
  submit,
  ...props
}) => {
  const inputRef = useRef(null);
  const [inputEnabled, handleInput] = useState(false);

  useEffect(() => {
    if (inputEnabled) {
      (inputRef as any).current.focus();
    }
  }, [inputEnabled]);

  const handleEdit = () => {
    handleInput(!inputEnabled);
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    onChange(e)
  };

  const handleBlur = (e: React.FormEvent<HTMLInputElement>) => {
    handleInput(false);
    clearValue(e)
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    submit()
  }

  return (
    <div className={styles.editButton}>
      <Input
        className={styles.editInput}
        name={name}
        disabled={!inputEnabled}
        key={defaultValue}
        placeholder={defaultValue}
        defaultValue={defaultValue}
        value={value || ''}
        onChange={handleChange}
        ref={inputRef}
        onPressEnter={handleSubmit}
        addonAfter={<Icon type="edit" onClick={handleEdit} />}
        onBlur={handleBlur}
        {...props}
      />

      {inputEnabled && (
        <Button type="primary" onMouseDown={handleSubmit}>
          Save
        </Button>
      )}
    </div>
  );
};
