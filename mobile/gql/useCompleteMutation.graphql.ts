/**
 * @generated SignedSource<<88d480ec63d623e9bedc19fb9e1ae51c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useCompleteMutation$variables = {
  id: string;
  timezone: string;
};
export type useCompleteMutation$data = {
  readonly completeHabit: boolean;
};
export type useCompleteMutation = {
  response: useCompleteMutation$data;
  variables: useCompleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "timezone"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "timezone",
        "variableName": "timezone"
      }
    ],
    "kind": "ScalarField",
    "name": "completeHabit",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useCompleteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useCompleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4a93eb6d785286d5191f90f4424e3254",
    "id": null,
    "metadata": {},
    "name": "useCompleteMutation",
    "operationKind": "mutation",
    "text": "mutation useCompleteMutation(\n  $id: ID!\n  $timezone: String!\n) {\n  completeHabit(id: $id, timezone: $timezone)\n}\n"
  }
};
})();

(node as any).hash = "1bf5fe93aa3b5a53d0dad71b2b39879b";

export default node;
