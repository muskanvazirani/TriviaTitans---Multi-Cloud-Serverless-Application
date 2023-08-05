import React, { useEffect, useRef } from 'react';

const LookerData = () => {
  const lookerWindow = useRef(null);

  useEffect(() => {
    if (lookerWindow.current === null || lookerWindow.current.closed) {
      lookerWindow.current = window.open('https://lookerstudio.google.com/embed/reporting/294d9b02-d999-4165-9b8d-dcb2f34f9f02/page/kD1YD', '_blank');
    }
  }, []);

  return null;
};

export default LookerData;
