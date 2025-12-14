/**
 * @generated SignedSource<<eaeb58c1a396caaf915a7adbf1cbf065>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useLoginMutation$variables = {
  email: string;
  password: string;
};
export type useLoginMutation$data = {
  readonly login: {
    readonly accessToken: string;
    readonly refreshToken: string;
  };
};
export type useLoginMutation = {
  response: useLoginMutation$data;
  variables: useLoginMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "password"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "password",
        "variableName": "password"
      }
    ],
    "concreteType": "Session",
    "kind": "LinkedField",
    "name": "login",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "accessToken",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "refreshToken",
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
    "name": "useLoginMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useLoginMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4afd5d17b4e5d8b14643ed1072233d45",
    "id": null,
    "metadata": {},
    "name": "useLoginMutation",
    "operationKind": "mutation",
    "text": "mutation useLoginMutation(\n  $email: String!\n  $password: String!\n) {\n  login(email: $email, password: $password) {\n    accessToken\n    refreshToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "080ab8ad87a762e54efc76ceada31f33";

export default node;
