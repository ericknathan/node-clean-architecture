# Clean Architecture App

<p align="center">
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-executar">Como executar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-licença">Licença</a>
</p>

<br>

<p align="center">
  <img alt="Imagem da aplicação 4Dev" src=".github/e-survey.png" width="100%">
</p>

## 💻 Projeto

Este projeto é uma API que se destaca por sua arquitetura bem definida e altamente modular. Incorporando as práticas de Desenvolvimento Orientado a Testes (TDD), busca assegurar a robustez e confiabilidade do código. A implementação segue os princípios fundamentais do SOLID, facilitando a manutenção e extensibilidade do sistema. A estrutura baseada em Clean Architecture proporciona uma distribuição clara de responsabilidades entre as diversas camadas, promovendo a separação de preocupações e garantindo uma maior flexibilidade na evolução do código. Além disso, a aplicação inteligente e criteriosa de Padrões de Projeto (Design Patterns) potencializa a solução de desafios recorrentes, resultando em um sistema mais escalável e eficiente.

## ✨ Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [NodeJS](https://nodejs.org)
- [Typescript](https://www.typescriptlang.org)
- [Express](https://expressjs.com)
- [Jest](https://jestjs.io)
- [MongoDb](https://www.mongodb.com)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)
- [Faker](https://fakerjs.dev/)
- [Supertest](https://www.npmjs.com/package/supertest)
- [Husky](https://typicode.github.io/husky)
- [Lint Staged](https://www.npmjs.com/package/lint-staged)
- [Eslint](https://eslint.org/)
- [Sucrase](https://www.npmjs.com/package/sucrase)

## 📚 Conceitos aplicados ao projeto
### Princípios
- Single Responsibility Principle (SRP)
- Open Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)
- Separation of Concerns (SOC)
- Don't Repeat Yourself (DRY)
- You Aren't Gonna Need It (YAGNI)
- Keep It Simple, Silly (KISS)
- Composition Over Inheritance
- Small Commits

### Design Patterns
- Factory
- Adapter
- Composite
- Decorator
- Proxy
- Dependency Injection
- Abstract Server
- Composition Root
- Builder
- Singleton

### Metodologias e Designs
- TDD
- Clean Architecture
- DDD
- Conventional Commits
- GitFlow
- Modular Design
- Dependency Diagrams
- Use Cases

### Features do Node
- Log de Erro
- Segurança (Hashing, Encryption e Encoding)
- CORS
- Middlewares
- Nível de Acesso nas Rotas (Admin, User e Anônimo)

### Features de Testes
- Testes Unitários
- Testes de Integração (API Rest)
- Cobertura de Testes
- Test Doubles
- Mocks
- Stubs
- Spies
- Fakes

### Features do MongoDb
- Connect e Reconnect
- Collections
- InsertOne e InserMany
- Find, FindOne e FindOneAndUpdate
- DeleteMany
- UpdateOne
- Aggregation (Match, Group, Unwind, Lookup, AddFields, Project, Sort)
- ObjectId
- Upsert e ReturnOriginal
- Push, Divide, Multiply, ArrayElemAt, Cond, Sum
- Filter, Map, Reduce, MergeObjects, ConcatArrays

## 🚀 Como executar

- Clone o repositório
- Instale as dependências com `npm i`, `yarn` ou `pnpm i`
- Inicie a aplicação web com `npm run start`, `yarn start` ou `pnpm run start`

Agora você pode acessar as rotas em [`localhost:5050`](http://localhost:5050) utilizando o [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/)

## 📄 Licença

Esse projeto está sob a licença GPL 3. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com ♥ por Erick Nathan durante o programa de formação [NodeJs, Typescript, TDD, DDD, Clean Architecture e SOLID](https://www.udemy.com/course/tdd-com-mango/) promovido pelo [Rodrigo Manguinho](https://www.udemy.com/course/tdd-com-mango/#instructor-1)
