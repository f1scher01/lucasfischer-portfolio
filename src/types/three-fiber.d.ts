import type { ThreeElements } from "@react-three/fiber";

/**
 * @react-three/fiber v8 só augmenta o namespace `JSX` global. Os tipos do
 * React 19 (@types/react 19) passaram a resolver os elementos intrínsecos via
 * `React.JSX`, então o `<mesh>`, `<ambientLight>` etc. ficam invisíveis ao TS.
 * Espelhamos a mesma augmentação em `React.JSX.IntrinsicElements`.
 *
 * Fix de tipos apenas — não altera a stack (R3F v8) nem o runtime.
 */
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}
