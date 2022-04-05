#include <bits/stdc++.h>
using namespace std;

bool isBalanced(string x) {
    stack<char> s1;

    for(auto a: x){
        if(a=='{') s1.push('}');
        else if(a=='[') s1.push(']');
        else if(a=='(') s1.push(')');
        else{
            if(s1.empty()) return false;
            else if(s1.top() != a) return false;
            s1.pop();
        }
    }
    if(s1.empty()) return true;
    return false;
}


int main()
{
	string inputPar="{{{}}]}";
	if(isBalanced(inputPar)) cout<<"True";
	else cout<<"False";
}