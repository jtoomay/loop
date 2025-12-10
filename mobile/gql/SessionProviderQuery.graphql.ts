/**
 * @generated SignedSource<<21e6e1c7e84bb2ecb3a728aaf5456771>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SessionProviderQuery$variables = Record<PropertyKey, never>;
export type SessionProviderQuery$data = {
  readonly sessionCheck: boolean;
};
export type SessionProviderQuery = {
  response: SessionProviderQuery$data;
  variables: SessionProviderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "sessionCheck",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SessionProviderQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SessionProviderQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "b6e0c7bda4e26c57c1b41fc3aef5d179",
    "id": null,
    "metadata": {},
    "name": "SessionProviderQuery",
    "operationKind": "query",
    "text": "query SessionProviderQuery {\n  sessionCheck\n}\n"
  }
};
})();

(node as any).hash = "68a6722d932a8f328e517b6571a5e473";

export default node;
