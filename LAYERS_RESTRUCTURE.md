# Layers Restructure Implementation

## New Architecture Completed ✅

### Core Changes Made:
1. **Layer Interface Updated**: 
   - Added `showInToggles: boolean`
   - Added `groups: PictureElementGroup[]` 
   - Layers now contain groups directly

2. **Config Structure Changed**:
   - Removed separate `groups` array from config
   - All groups now nested within layers
   - Backward compatibility added for migration

3. **Element Processing Updated**:
   - Flattens layers → groups → elements
   - CSS variables still used for smooth visibility
   - Layer ID tracked per element

4. **Layers Element Updated**:
   - Only shows layers with `showInToggles: true`
   - Filters properly for toggle display

### New Configuration Format:
```yaml
type: custom:picture-elements-scalable
layers:
  - id: lights
    name: Lights
    icon: mdi:lightbulb
    visible: true
    showInToggles: true
    groups:
      - group_name: Living Room Lights
        elements: [...]
      - group_name: Kitchen Lights  
        elements: [...]
  - id: security
    name: Security
    icon: mdi:shield-home
    visible: true
    showInToggles: true
    groups:
      - group_name: Cameras
        elements: [...]
  - id: background
    name: Background Elements
    icon: mdi:image
    visible: true
    showInToggles: false  # Won't appear in toggle controls
    groups:
      - group_name: Static Elements
        elements: [...]
```

### Status:
- ✅ Main card functionality working
- ✅ Layer visibility system working  
- ✅ Backward compatibility implemented
- ⚠️ Editor needs rewrite for new structure (currently broken)

### Next Steps:
1. Rewrite editor UI for nested layer → groups structure
2. Add layer management (add/edit/delete with showInToggles)
3. Add group management within layers
4. Test full functionality
