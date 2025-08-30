# MCP Navigator Data Source Scripts Documentation

## 📋 Overview

This document provides detailed information about the data collection, processing, and update mechanisms in the MCP Navigator project, helping contributors understand how to add or modify MCP server information.

## 🗂️ Script Architecture

### Core Script Files

```
code/
├── comprehensive_mcp_collector.py    # Main data collector
├── mcp_data_collector.py            # Systematic data collector
├── data_validation.py               # Data validation script
└── quick_data_check.py              # Quick data check
```

### Data Files

```
data/
├── comprehensive_mcp_directory.json  # Main database (46 servers)
└── mcp_servers_database.json        # Simplified database (17 servers)
```

## 🔧 Script Functions Explained

### 1. comprehensive_mcp_collector.py

**Function:** Main comprehensive data collector

**Features:**
- Collects MCP server information from multiple sources
- Contains a complete directory of 50+ MCP servers
- Supports official reference servers, community contributions, and third-party developed servers

**Usage:**
```bash
# Direct script execution
python code/comprehensive_mcp_collector.py

# Or import and use in Python
from comprehensive_mcp_collector import ComprehensiveMCPCollector
collector = ComprehensiveMCPCollector()
data = collector.export_comprehensive_data('output.json')
```

**Data Sources:**
- Anthropic official server repository
- Official examples and documentation
- Community-collected awesome lists
- Third-party developer contributions

### 2. mcp_data_collector.py

**Function:** Systematic data collector

**Features:**
- Loads data from browser-extracted content
- Processes official example data
- Supports multiple data source integration

**Main Methods:**
```python
# Load browser-extracted data
load_browser_extracted_data()

# Load official example data
load_examples_data()
```

### 3. data_validation.py

**Function:** Data validation script

**Validation Items:**
- Data integrity checks
- Required field validation
- Category statistics analysis
- Data quality reporting

**Execution:**
```bash
python code/data_validation.py
```

**Output Report Includes:**
- Total number of servers
- Category distribution statistics
- Missing field checks
- Sample server validation

### 4. quick_data_check.py

**Function:** Quick data check

**Check Items:**
- Data structure validation
- Metadata consistency
- Basic integrity checks

## 📊 Data Structure Specification

### Server Data Format

```json
{
  "name": "Server Name",
  "description": "Server Description",
  "category": "Category Name",
  "repository_link": "GitHub Repository Link",
  "creator": "Creator Name",
  "installation": "Installation Command",
  "documentation": "Documentation Link",
  "popularity": "Popularity Level (high/medium/low)"
}
```

### Category Data Format

```json
{
  "name": "Category Name",
  "count": "Number of Servers",
  "description": "Category Description",
  "icon": "Icon",
  "color": "Color Code",
  "servers": ["Server List"]
}
```

## 🔄 Data Update Mechanism

### Current Status: Manual Updates

**Important Note:** Currently, MCP Navigator's data updates are **manually executed**, not periodic automated tasks.

### Update Process

1. **Data Collection**
   ```bash
   # Execute main collector
   python code/comprehensive_mcp_collector.py
   ```

2. **Data Validation**
   ```bash
   # Validate data quality
   python code/data_validation.py
   ```

3. **Quick Check**
   ```bash
   # Quick structure validation
   python code/quick_data_check.py
   ```

4. **Update Frontend Data**
   - Copy generated JSON files to `mcp-navigator/public/data/` directory
   - Ensure frontend application can correctly read new data

## 🆕 How to Add New MCP Servers

### Method 1: Modify Collector Script

1. Edit `comprehensive_mcp_collector.py`
2. Add new entry to the appropriate server list:

```python
{
    'name': 'New Server Name',
    'description': 'Detailed Description',
    'category': 'Appropriate Category',
    'repository_link': 'GitHub Link',
    'creator': 'Creator Name',
    'installation': 'Installation Command',
    'documentation': 'Documentation Link',
    'popularity': 'medium'  # high/medium/low
}
```

3. Re-execute the collection script

### Method 2: Direct Data File Modification

1. Edit `data/comprehensive_mcp_directory.json`
2. Add new server to the `servers` array
3. Update counts in `metadata`
4. Run validation script to ensure data correctness

## 🔧 How to Modify Existing Server Information

### Steps

1. **Locate Server**
   - Search for server name in data files
   - Or find corresponding entry in collector script

2. **Modify Information**
   - Update description, category, links, etc.
   - Ensure all required fields have values

3. **Validate Changes**
   ```bash
   python code/data_validation.py
   ```

4. **Test Frontend**
   - Start development server
   - Check if changes display correctly

## 📝 Adding New Categories Guide

### Steps

1. **Define New Category in Collector**
   ```python
   {
       'name': 'New Category Name',
       'count': 0,  # Will be automatically calculated
       'description': 'Category Description',
       'icon': '🔧',  # Choose appropriate emoji
       'color': '#FF5722',  # Choose color code
       'servers': []  # Will be automatically populated
   }
   ```

2. **Assign Servers to New Category**
   - Modify servers' `category` field

3. **Regenerate Data**
   - Execute collection script
   - Verify category statistics are correct

## 🚀 Automation Suggestions

### Future Improvement Directions

1. **GitHub Actions Automation**
   - Set up periodic script execution
   - Automatically check for new MCP servers
   - Auto-commit data updates

2. **API Monitoring**
   - Monitor official MCP repository updates
   - Automatically discover new servers
   - Notify maintainers for review

3. **Community Contribution Mechanism**
   - Create PR templates
   - Automated validation workflows
   - Streamline contribution process

## ⚠️ Important Notes

### Data Quality

- Ensure all required fields have values
- Validate GitHub link validity
- Check installation command correctness
- Maintain description accuracy and consistency

### Version Control

- Commit to Git after each data update
- Use meaningful commit messages
- Tag important version updates

### Testing

- Test frontend display after updates
- Ensure search functionality works
- Verify category filtering functionality

## 📞 Support

For questions or suggestions, please:

1. Check existing Issues
2. Create new Issue describing the problem
3. Submit Pull Request for improvements

---

**Last Updated:** January 15, 2025  
**Maintainers:** MCP Navigator Project Team