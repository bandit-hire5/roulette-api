import ICompany from "~src/interfaces/entity/company";

export default interface CompanyRepository {
  create(data: ICompany): Promise<ICompany>;

  get(id: string): Promise<ICompany>;
}
