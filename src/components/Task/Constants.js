
export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  c: "10.2.0",
  cpp: "10.2.0",
  rust: "1.68.2",   
  dart: "2.19.6",
  go: "1.16.2",      
  ruby: "3.0.1"
};


export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Welcome to, " + name + "!");\n}\n\ngreet("Code Flow");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Welcome to, " + data.name + "!");\n}\n\ngreet({ name: "Code Flow" });\n`,
  python: `\ndef greet(name):\n\tprint("Welcome to, " + name + "!")\n\ngreet("Code Flow")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Welcome to Code Flow! in Java");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Welcome to Code Flow in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Code Flow';\necho $name;\n",
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Welcome to Code Flow in C++!" << endl;\n\treturn 0;\n}`,
  rust: `
fn main() {
  println!("Welcome to Code Flow in Rust!");
}
`,
  dart: `
void main() {
  print('Welcome to Code Flow in Dart!');
}
`,
  go: `package main\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Welcome to Code Flow in Go!")\n}`,
  ruby: `def greet(name)\n\tputs "Welcome to Code Flow, #{name}!"\nend\n\ngreet("Ruby")`
};
