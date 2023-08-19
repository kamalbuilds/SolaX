import { Button } from "@chakra-ui/button";
import { useColorMode } from "@chakra-ui/color-mode";
import { IconSunFilled, IconMoonFilled } from '@tabler/icons-react';

const ToggleColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      onClick={() => toggleColorMode()}
      pos="absolute"
      top="0"
      right="0"
      m="1rem"
      style={{ zIndex: 10 }}
    >
      {colorMode === "dark" ? (
        <IconSunFilled size={24} />
      ) : (
        <IconMoonFilled size={24} />
      )}
    </Button>
  );
};

export default ToggleColorMode;