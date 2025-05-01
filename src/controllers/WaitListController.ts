import {Request,Response} from 'express';
import { waitList } from '../models/schema';
export class WaitListController {

    static insertWaitList:any = async (req: Request, res: Response) => {
        try {
            const {name,email,message} = req.body;
            if (!name || !email || !message) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const insertedWaitlist=await waitList.create({name,email,message});
            res.status(201).send({status:true, message: "Waitlist added successfully", data: insertedWaitlist });
        } catch (error:any) {
            res.status(500).send({ status:false,message: error });
        }
    }

    static getWaitList:any = async (req: Request, res: Response) => {
        try {
            const waitlist = await waitList.find();
            res.status(200).send({ status:true,message: "Waitlist fetched successfully", data: waitlist });
        } catch (error:any) {
            res.status(500).send({ status:false,message: error });
        }
    }

    static deleteWaitList:any = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const waitlist = await waitList.findByIdAndDelete(id);
            if (!waitlist) {
                return res.status(404).send({ status:false,message: "Waitlist not found" });
            }
            res.status(200).send({ status:true,message: "Waitlist deleted successfully", data: waitlist });
            
        } catch (error:any) {
            res.status(500).send({ status:false,message: error });
            
        }
    }
}