/**
 * @generated SignedSource<<5f923af2ba24891c8b4fe5c9ce014400>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AppMutation$variables = Record<PropertyKey, never>;
export type AppMutation$data = {
  readonly logout: boolean;
};
export type AppMutation = {
  response: AppMutation$data;
  variables: AppMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "logout",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "803ede27a1712f206c05dacf2d6848c5",
    "id": null,
    "metadata": {},
    "name": "AppMutation",
    "operationKind": "mutation",
    "text": "mutation AppMutation {\n  logout\n}\n"
  }
};
})();

(node as any).hash = "aa7579295297809118f188c92b3469a5";

export default node;
