import React, { useState } from 'react';
import Circle from '@uiw/react-color-circle';

export default function ColorPicker({ onSelectColor }) {
  const [hex, setHex] = useState('#F44E3B');
  return (
    <Circle
      colors={[
        '#F44336',
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFEB3B',
        '#FFC107',
        '#FF9800',
        '#FF5722',
      ]}
      color={hex}
      onChange={(color) => {
        setHex(color.hex);
        onSelectColor(color.hex); // 선택한 색상을 객체 형태로 전달
      }}
    />
  );
}
