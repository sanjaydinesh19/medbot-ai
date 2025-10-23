import torch
import cv2
import numpy as np

def generate_gradcam(model, img_tensor, target_layer, device):
    """
    Generate a Grad-CAM heatmap for a given image tensor.
    Returns a NumPy heatmap array normalized to 0–255.
    """
    model.eval()
    gradients = []
    activations = []

    def forward_hook(module, inp, out):
        activations.append(out.detach())

    def backward_hook(module, grad_in, grad_out):
        gradients.append(grad_out[0].detach())

    # Register hooks
    handle_f = target_layer.register_forward_hook(forward_hook)
    handle_b = target_layer.register_backward_hook(backward_hook)

    # Forward pass
    output = model(img_tensor)
    class_idx = int(torch.sigmoid(output) >= 0.5)
    score = output[:, 0]  # binary class

    # Backward pass
    model.zero_grad()
    score.backward(retain_graph=True)

    # Extract activations and gradients
    grads = gradients[0]
    acts = activations[0]
    weights = torch.mean(grads, dim=(2, 3), keepdim=True)
    cam = torch.sum(weights * acts, dim=1).squeeze()

    cam = torch.relu(cam)
    cam -= cam.min()
    cam /= cam.max() + 1e-8
    cam = cam.cpu().numpy()

    # Resize and scale to 0–255
    heatmap = cv2.resize(cam, (224, 224))
    heatmap = np.uint8(255 * heatmap)

    # Clean up
    handle_f.remove()
    handle_b.remove()

    return heatmap
