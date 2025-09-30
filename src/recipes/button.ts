import { defineRecipe } from "@chakra-ui/react"

export const buttonRecipe = defineRecipe({
  base: {
    display: "flex",
  },
  variants: {
    variant: {
      solid: { bg: "brand.500" },
      outline: { borderWidth: "1px", borderColor: "brand.500" },
    },
    
  },
   defaultVariants: {
    variant: "solid",
  },
})