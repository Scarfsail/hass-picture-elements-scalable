# Layer Visibility Persistence ID - Usage Examples

## Example Configurations

### 1. Default Behavior (Shared State)
```yaml
type: custom:picture-elements-scalable
image: /local/floorplan.png
layers:
  - name: "Lights"
    visible: true
    showInToggles: true
    # ... layer config
  - name: "Sensors"
    visible: false
    showInToggles: true
    # ... layer config
# No layers_visibility_persistence_id = all cards without this parameter share state
```

### 2. Unique State Per Card
```yaml
type: custom:picture-elements-scalable
image: /local/floorplan.png
layers_visibility_persistence_id: "living-room-card"
layers:
  - name: "Lights"
    visible: true
    showInToggles: true
    # ... layer config
```

### 3. Shared State Across Multiple Cards
```yaml
# Living Room Card
type: custom:picture-elements-scalable
image: /local/living-room.png
layers_visibility_persistence_id: "main-floor"
layers:
  - name: "Lights"
    showInToggles: true
    # ...

# Kitchen Card (shares state with living room)
type: custom:picture-elements-scalable  
image: /local/kitchen.png
layers_visibility_persistence_id: "main-floor"  # Same ID = shared state!
layers:
  - name: "Lights"
    showInToggles: true
    # ...
```

### 4. Different Areas with Separate States
```yaml
# Ground Floor
type: custom:picture-elements-scalable
layers_visibility_persistence_id: "ground-floor"
# ...

# First Floor  
type: custom:picture-elements-scalable
layers_visibility_persistence_id: "first-floor"
# ...

# Basement
type: custom:picture-elements-scalable
layers_visibility_persistence_id: "basement"
# ...
```

## Benefits

✅ **Stable Storage**: Persistence ID doesn't change when you modify card configuration  
✅ **Flexible Sharing**: Choose exactly which cards share layer visibility state  
✅ **Simple Default**: Cards without the parameter automatically share state  
✅ **User Control**: Complete control over persistence behavior per card  
✅ **Configuration Friendly**: Changes to layers, images, etc. don't reset layer states  

## Storage Keys Generated

- No parameter: `hass-layers-state-default`
- `layers_visibility_persistence_id: "living-room"`: `hass-layers-state-living-room`
- `layers_visibility_persistence_id: "main-floor"`: `hass-layers-state-main-floor`