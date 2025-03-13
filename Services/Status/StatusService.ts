import { IStatusService } from "../../Interface/Status/IStatusService";
import { StatusParams } from "../../Models/Status/StatusParams";
import Http from "../Http/HttpClient";

export class StatusService implements IStatusService{
    async ApplyStatusToDelete(IdPost:string): Promise<any> {
        let result = await new Promise<any>((resolve, reject) => {
            Http.put(`/api/StatusPost/ApplyStatusToDelete?idPost=${IdPost}`)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
        return result;
    }
    async ApplyStatusToArchived(IdPost:string): Promise<any> {
        let result = await new Promise<any>((resolve, reject) => {
            Http.put(`/api/StatusPost/ApplyStatusToAchived?idPost=${IdPost}`)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
        return result;
    }
    
    async ApplyStatusToActive(IdPost:string): Promise<any> {
        let result = await new Promise<any>((resolve, reject) => {
            Http.put(`/api/StatusPost/ApplyStatusToActive?idPost=${IdPost}`)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
        return result;
    }
}

const Status = new StatusService();
export default Status;