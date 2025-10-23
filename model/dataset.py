from torch.utils.data import Dataset
from PIL import Image
import os

class CXRDataset(Dataset):
    """
    A PyTorch Dataset for Chest X-ray images.
    Expects a DataFrame with columns ['image', 'label'].
    """
    def __init__(self, df, img_dir, transform=None):
        self.df = df.reset_index(drop=True)
        self.img_dir = img_dir
        self.transform = transform

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.loc[idx]
        img_path = os.path.join(self.img_dir, row['image'])
        img = Image.open(img_path).convert('RGB')

        if self.transform:
            img = self.transform(img)

        label = int(row['label'])
        return img, label