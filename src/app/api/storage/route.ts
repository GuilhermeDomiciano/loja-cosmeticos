import { StorageController } from "@/core/controllers/storageController";

export async function POST(req: Request) {
  return StorageController.upload(req);
}
