/**
 * @generated SignedSource<<7c9ae6c86e2cfa15a1d950cb7a9c9367>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateHabitInput = {
  days: ReadonlyArray<number>;
  description?: string | null | undefined;
  priority: number;
  time: string;
  title: string;
};
export type CreateScreenMutation$variables = {
  input: CreateHabitInput;
};
export type CreateScreenMutation$data = {
  readonly createHabit: {
    readonly id: string;
  };
};
export type CreateScreenMutation = {
  response: CreateScreenMutation$data;
  variables: CreateScreenMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Habit",
    "kind": "LinkedField",
    "name": "createHabit",
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
    "name": "CreateScreenMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateScreenMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f78fe7a4c12ec9e0f5f9a4655c5a6f5c",
    "id": null,
    "metadata": {},
    "name": "CreateScreenMutation",
    "operationKind": "mutation",
    "text": "mutation CreateScreenMutation(\n  $input: CreateHabitInput!\n) {\n  createHabit(input: $input) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "42ae6d68a4883b34f1ea473be9c7d264";

export default node;
