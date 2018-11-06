#ifndef KNITOUTWRITER_H
#define KNITOUTWRITER_H
#include <vector>
#include <iostream>
#include <algorithm>
#include <fstream>
// A header only version of knitout writer for c++
class KnitoutWriter{
public:
    bool half_gauge = false;
    std::vector<std::string> carriers;
    std::vector<std::string> operations;
    std::vector<std::string> headers;
    enum class Direction { plus, minus };  // enum class
    enum class Bed { front, back, frontslider, backslider };
    static std::string direction_to_str(Direction dir){
       return  (dir == Direction::minus ? "-" : "+");
    }

    static std::string bed_to_str(Bed b){
        if(b == Bed::back){
            return "b";
        }
        else if(b == Bed::front){
            return "f";
        }
        else if(b == Bed::backslider){
            return "bs";
        }
        else if(b == Bed::frontslider){
            return "fs";
        }
        assert(false && "invalid bed ");
        return "";
    }
    class BedNeedle{
    public:
        Bed bed = Bed::front;
        int needle = 0;
        BedNeedle(){}
        BedNeedle(Bed b, int n){
            this->bed = b;
            this->needle = n;
        }
        std::string to_str(){
            return bed_to_str(bed) + std::to_string(needle);
        }
        /*
        std::string to_hg_str(){
        assert(false && "TODO_IMPLEMENT");
        return to_str();
        }*/
    };
    static std::string join_stringlist(std::vector<std::string> list, std::string sep =""){
        std::string str = "";
        for(auto l : list){
            str += l + sep;
        }
        return str;
    }
    static std::string carriers_to_str(std::vector<std::string> carriers){

        return join_stringlist(carriers," ");
    }


    KnitoutWriter(std::vector<std::string> &crs){
        if(crs.empty()){
            std::cerr << "Carriers not defined." << std::endl;
            exit(0);
        }
        this->carriers = crs;
        std::string hdr_carriers = ";;Carriers:";
        for(auto s : carriers){
            hdr_carriers += " " + s;
        }
        this->headers.push_back(hdr_carriers);
    }

    void setHalfGauge(){
        this->half_gauge = true;
    }
    void setFullGauge(){
        this->half_gauge = false;
    }
    void addHeader(std::string name, std::string value){
        std::transform(name.begin(), name.end(), name.begin(), ::tolower);
        std::transform(value.begin(), value.end(), value.begin(), ::tolower);
        // todo error check params
        this->headers.push_back(";;" + name + ": "+ value);

    }
    void addRawOperation(std::string op){
        std::cerr<<"Warning, no error checking is performed on: " << op << std::endl;
        this->operations.push_back(op);
    }

    void in(std::vector<std::string> carriers){
        assert(!carriers.empty());
        std::string cs = "";
        for(auto c : carriers) cs += c + " ";
        this->operations.push_back("in "+cs);
    }
    void inhook(std::vector<std::string> carriers){
        assert(!carriers.empty());
        std::string cs = "";
        for(auto c : carriers) cs += c + " ";
        this->operations.push_back("inhook "+cs);

    }
    void releasehook(std::vector<std::string> carriers){
        assert(!carriers.empty());
        std::string cs = "";
        for(auto c : carriers) cs += c + " ";
        this->operations.push_back("releasehook "+cs);
    }
    void out(std::vector<std::string> carriers){
        assert(!carriers.empty());
        std::string cs = "";
        for(auto c : carriers) cs += c + " ";
        this->operations.push_back("out "+cs);
    }
    void outhook(std::vector<std::string> carriers){
        assert(!carriers.empty());
        std::string cs = "";
        for(auto c : carriers) cs += c + " ";
        this->operations.push_back("outhook "+cs);
    }
    void stitch(int before, int after){
        this->operations.push_back("stitch "+ std::to_string(before) + " " + std::to_string(after));
    }
    //extension
    void stitchNumber(int n){
        this->operations.push_back("x-stitch-number "+ std::to_string(n));
    }
    void rack(float r){
        this->operations.push_back("rack " + std::to_string(r));
    }

    void knit(Direction dir, Bed b, int needle, std::vector<std::string> carriers={}){
        std::string dir_str = direction_to_str(dir);
        std::string bed_str = bed_to_str(b);
        std::string needle_str = std::to_string(needle);
        std::string op = "knit " + dir_str + " " + bed_str+needle_str+" "+carriers_to_str(carriers);
        this->operations.push_back(op);
    }
    void tuck(Direction dir, Bed b, int needle, std::vector<std::string> carriers={}){
        std::string dir_str = direction_to_str(dir);
        std::string bed_str = bed_to_str(b);
        std::string needle_str = std::to_string(needle);
        std::string op = "tuck " + dir_str + " " + bed_str+needle_str+" "+carriers_to_str(carriers);
        this->operations.push_back(op);
    }
    void knit(Direction dir, BedNeedle bn, std::vector<std::string> carriers={}){
        std::string dir_str = direction_to_str(dir);

        std::string op = "knit " + dir_str + " " + bn.to_str()+" "+carriers_to_str(carriers);
        this->operations.push_back(op);
    }
    void tuck(Direction dir, BedNeedle bn, std::vector<std::string> carriers={}){
        std::string dir_str = direction_to_str(dir);
        std::string op = "tuck " + dir_str + " " + bn.to_str()+" "+carriers_to_str(carriers);
        this->operations.push_back(op);
    }
    void split(Direction dir, BedNeedle from, BedNeedle to, std::vector<std::string> carriers={}){
        std::string dir_str = direction_to_str(dir);
        std::string from_str = from.to_str();
        std::string to_str = to.to_str();
        std::string cs_str = carriers_to_str(carriers);
        std::string op = "split " + dir_str + " " + from_str + " " + to_str + " " + cs_str;
        this->operations.push_back(op);
    }
    void miss(Direction dir, BedNeedle bn, std::vector<std::string> carriers={}){
        std::string op  = "miss " + direction_to_str(dir) + " " + bn.to_str() + " " + carriers_to_str(carriers);
        this->operations.push_back(op);
    }
    // knit without yarn, but explicitly supported in knitout
    void drop(BedNeedle bn){
        std::string op = "drop " + bn.to_str();
        this->operations.push_back(op);
    }
    void amiss(BedNeedle bn){
        std::string op = "amiss " + bn.to_str();
        this->operations.push_back(op);
    }
    void xfer(BedNeedle from, BedNeedle to){
        std::string op = "xfer " + from.to_str() + " " + to.to_str();
        this->operations.push_back(op);
     }
    void comment(std::string comment){
        // strip any ;
        this->operations.push_back(";"+comment);
    }
    void pause(std::string comment){
        this->comment(comment);
        this->operations.push_back("pause");
    }


    std::string content(){

        std::string version = ";!knitout-2\n";
        std::string content = version  +
                join_stringlist(this->headers, "\n") +
                join_stringlist(this->operations,"\n");
       return content;

    }
    void write(std::string filename){
        std::ofstream out(filename);
        if(!out.is_open()){
            std::cerr<<"Could not write to file " << filename << std::endl;
            assert(false);
        }
        std::string content = this->content();
        out << content;
        out.close();

    }

};

#endif // KNITOUTWRITER_H
