// const ENV = "development"
const ENV = "production"
const BASE_URL_DEV = "http://localhost"
const BASE_URL_PROD = "http://137.184.81.207"
const BASE_URL = ENV == "development" ? BASE_URL_DEV : BASE_URL_PROD
const LOGIN_URL = `${BASE_URL}:9000/login`
const API_URL = `${BASE_URL}:9000/contacts`
const TEST_URL = `${BASE_URL}:3000/contacts`
const BUTTON = "Novo Contato"
const ENTITY = { _id: "1", name: "Contato 1", phone: "123456789"}
const ENTITY_PLURAL_NAME = "Mensagens"
const TEST_NAME = `Página de ${ENTITY_PLURAL_NAME}`

describe(TEST_NAME, () => {
  beforeEach(() => {
    cy.fixture("token").then((token) => {
      console.log(token);
      cy.intercept("POST", `${LOGIN_URL}`, {
        statusCode: 200,
        body: { token: token.token }
      });

      cy.intercept("GET", `${API_URL}`, {
        statusCode: 200,
        body: [ ENTITY ]
      }).as("getPlans");

      localStorage.setItem("token", token.token);
      cy.visit(`${TEST_URL}`);
    })
  });

  it(`deve exibir uma lista de ${ENTITY_PLURAL_NAME}`, () => {
    cy.get("table").should("exist");
    cy.get("table tbody tr").should("have.length.at.least", 1);
  });

  it(`deve mudar da tabela para o formulário ao clicar em ${BUTTON}`, () => {
    cy.get("button").contains(BUTTON).click();
    cy.get("form").should("exist");
    cy.get("table").should("not.exist");
  });

  it("deve mudar do formulário para a tabela ao clicar em Cancelar", () => {
    cy.get("button").contains(BUTTON).click();
    cy.get("form").should("exist");
    cy.get("table").should("not.exist");
    cy.get("button").contains("Cancelar").click();
    cy.get("table").should("exist");
    cy.get("form").should("not.exist");
  });
});