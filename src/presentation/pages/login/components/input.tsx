import React from 'react';
import { InputBase } from '@/presentation/components';

type Props = {
  type: string,
  name: string,
  placeholder: string
}

const Input: React.FC<Props> = ({ type, name, placeholder }: Props) => (
  <InputBase
    type={type}
    name={name}
    placeholder={placeholder}
    state={{}}
    setState={{}}
  />
);

export default Input;
