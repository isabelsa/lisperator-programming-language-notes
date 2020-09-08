# Description of the AST

An AST node is a plain JavaScript object that has a type property specifying what kind of node it is, and additional information, depending on the particular type.

```
num { type: "num", value: NUMBER }
str { type: "str", value: STRING }
bool { type: "bool", value: true or false }
var { type: "var", value: NAME }
lambda { type: "lambda", vars: [ NAME... ], body: AST }
call { type: "call", func: AST, args: [ AST... ] }
if { type: "if", cond: AST, then: AST, else: AST }
assign { type: "assign", operator: "=", left: AST, right: AST }
binary { type: "binary", operator: OPERATOR, left: AST, right: AST }
prog { type: "prog", prog: [ AST... ] }
let { type: "let", vars: [ VARS... ], body: AST }
```

---

## Examples

### Numbers ("num")

123.5 →
`{ type: "num", value: 123.5 }`

### Strings ("str")

"Hello World!" → `{ type: "str", value: "Hello World!" }`

### Booleans ("bool")

true, false → `{ type: "bool", value: true }, { type: "bool", value: false }`

### Identifiers ("var")

foo → `{ type: "var", value: "foo" }`

### Functions ("lambda")

lambda (x) 10 # or λ (x) 10 →

```
{
  type: "lambda",
  vars: [ "x" ],
  body: { type: "num", value: 10 }
}
```

### Function calls ("call")

foo(a, 1) →

```
{
  "type": "call",
  "func": { "type": "var", "value": "foo" },
  "args": [
    { "type": "var", "value": "a" },
    { "type": "num", "value": 1 }
  ]
}
```

### Conditionals ("if")

if foo then bar else baz
→

```

{
  "type": "if",
  "cond": { "type": "var", "value": "foo" },
  "then": { "type": "var", "value": "bar" },
  "else": { "type": "var", "value": "baz" }
}

```

The else branch is optional:

if foo then bar
→

```
{
  "type": "if",
  "cond": { "type": "var", "value": "foo" },
  "then": { "type": "var", "value": "bar" }
}

```

### Assignment ("assign")

a = 10
→

```
{
  "type": "assign",
  "operator": "=",
  "left": { "type": "var", "value": "a" },
  "right": { "type": "num", "value": 10 }
}

```

### Binary expressions ("binary")

x + y \_ z
→

```
{
  "type": "binary",
  "operator": "+",
  "left": { "type": "var", "value": "x" },
  "right": {
    "type": "binary",
    "operator": "_",
    "left": { "type": "var", "value": "y" },
    "right": { "type": "var", "value": "z" }
  }
}
```

### Sequences ("prog")

```
{
  a = 5;
  b = a _ 2;
  a + b;
}
```

→

```
{
  "type": "prog",
  "prog": [
    {
      "type": "assign",
      "operator": "=",
      "left": { "type": "var", "value": "a" },
      "right": { "type": "num", "value": 5 }
    },
    {
      "type": "assign",
      "operator": "=",
      "left": { "type": "var", "value": "b" },
      "right": {
        "type": "binary",
        "operator": "_",
        "left": { "type": "var", "value": "a" },
        "right": { "type": "num", "value": 2 }
      }
    },
    {
      "type": "binary",
      "operator": "+",
      "left": { "type": "var", "value": "a" },
      "right": { "type": "var", "value": "b" }
    }
  ]
}
```

### Block scoped variables ("let")

let (a = 10, b = a \* 10) {
a + b;
}
The first version of the parser will not implement this node type, we will add it later.

→
{
"type": "let",
"vars": [
{
"name": "a",
"def": { "type": "num", "value": 10 }
},
{
"name": "b",
"def": {
"type": "binary",
"operator": "*",
"left": { "type": "var", "value": "a" },
"right": { "type": "num", "value": 10 }
}
}
],
"body": {
"type": "binary",
"operator": "+",
"left": { "type": "var", "value": "a" },
"right": { "type": "var", "value": "b" }
}
}

```

```
