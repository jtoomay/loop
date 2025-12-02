/**
 * @generated SignedSource<<af897a9f6ec1a9cbee597fd031d42654>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type exploreMutation$variables = {
  name: string;
};
export type exploreMutation$data = {
  readonly createUser: {
    readonly id: string;
  };
};
export type exploreMutation = {
  response: exploreMutation$data;
  variables: exploreMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "createUser",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "exploreMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "exploreMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2aae1e4d03f436d9473eb2641b47929a",
    "id": null,
    "metadata": {},
    "name": "exploreMutation",
    "operationKind": "mutation",
    "text": "mutation exploreMutation(\n  $name: String!\n) {\n  createUser(name: $name) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "1cdef829db727605aa00c206e08f21d3";

export default node;
