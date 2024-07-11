import { Model, Document, FilterQuery, PopulateOptions, UpdateQuery, Query } from 'mongoose';
import { IDao } from '../types/IDao';
// import { PDFDocument } from 'pdf-lib';
// import { Packer, Paragraph, TextRun } from 'docx';
import DataOptions from '../types/DataOptions';

export class MongooseDao<T extends Document> implements IDao<T> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async slice(start: number, end: number): Promise<T[]> {
        try {
        // Vérifiez les bornes start et end pour éviter des valeurs négatives ou incorrectes
            start = Math.max(start, 0);
            end = Math.max(end, 0);

            const results = await this.model.find().skip(start).limit(end - start);
            return results;
        } catch (error) {
            console.error('Error during slice:', error);
            return [];
        }
    }

    async getByCriteria(criteria: FilterQuery<T>): Promise<T[]> {
        try {
            return this.model.find(criteria);
        } catch (err) {
            throw err;
        }
    }

    async getByItem(item: FilterQuery<T>): Promise<T[]> {
        try {
            // const getByItem: UpdateQuery<T> = { $set: item };
            return this.model.find({ item });
        } catch (err) {
            throw err;
        }
    }

    async getByCriterial(criterial: FilterQuery<T>): Promise<T[]> {
        try {
            return this.model.find(criterial).exec();
        } catch (err) {
            throw err;
        }
    }

    async getAllAgregate(dataOptions: DataOptions[]): Promise<T[]> {
        try {
            const populateOptions = dataOptions.map(option => {
                return {
                    path: option.fieldName,
                    select: option.nestedFields
                }
            });

            let query = this.model.find({}).populate(populateOptions);
            return await query.exec() as T[];
        } catch (err) {
            throw err
        }
    }

    async all(id: string) {
        try {
            return this.model.find();
        } catch (err) {
            throw err
        }
    }

    async getById(id: string): Promise<T | null> {
        try {
            return this.model.findById(id);
        } catch (err) {
            throw err
        }
    }

    async create(item: T | any): Promise<T> {
        try {
            const newItem = new this.model(item);
            const savedItem = await newItem.save();
            return savedItem;//@ts-ignore
        } catch (err: Error) {
            throw err
        }
    }

    async update(id: string, item: []): Promise<T | null> {
        try {
            const update: UpdateQuery<T> = { $set: item };
            return this.model.findByIdAndUpdate(id, update, { new: true });
        } catch (err) {
            throw err;
        }
    }

    async delete(id: string): Promise<T | null> {
        try {
            return this.model.findByIdAndDelete(id);
        } catch (err) {
            throw err;
        }
    }

    async count(): Promise<number> {
        try {
            return this.model.countDocuments();
        } catch (err) {
            throw err;
        }
    }

    async bulkCreate(items: any[]): Promise<T[]> {
        try {
            return await this.model.insertMany(items);
        } catch (err) {
            throw err;
        }
    } v

    async find(criteria: FilterQuery<T>, options?: any) {
        try {
            const results = await this.model.find(criteria, null, options).exec();

            if (results.length === 0) {
                return []; // Retourne un tableau vide si aucune correspondance n'est trouvée
            }

            return results;
        } catch (err) {
            throw err;
        }
    }

    // async createPDF(title: string, content: string): Promise<Buffer> {
    //     const pdfDoc = await PDFDocument.create();
    //     const page = pdfDoc.addPage();
    //      page.drawText(`${title}\n\n${content}`, {
    //         x: 50,
    //         y: 700,
    //         size: 12,
    //     });
        
    //     return await pdfDoc.save();
    // }

    //  async  createWordDoc(title: string, content: string): Promise<Buffer> {
    //     const doc = new Document();
    //     doc.addSection({
    //       children: [
    //         new Paragraph({
    //           children: [new TextRun({ text: title, bold: true, size: 32 })],
    //         }),
    //         new Paragraph({
    //           children: [new TextRun({ text: content, size: 24 })],
    //         }),
    //       ],
    //     });
    //     return await Packer.toBuffer(doc);
    //   }

    // async  saveFile(filename: string, data: Buffer): Promise<void> {
    //     await fs.writeFile(`./uploads/${filename}`, data);
    // }
}